
        document.addEventListener('DOMContentLoaded', () => {
            const token = localStorage.getItem('accessToken');
            const userType = localStorage.getItem('userType');
            let user = JSON.parse(localStorage.getItem('user'));

            if (!user || !token || userType !== 'student') {
                window.location.href = 'singin.html';
                return;
            }

            const loaderIcon = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
            const dashboardUsernames = document.querySelectorAll('.font-medium');
            const dashboardAvatars = document.querySelectorAll('img[alt="Profile"]');
            const profileCardName = document.querySelector('.profile-card-name');
            const settingsBtn = document.getElementById('settingsBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            
            const settingsModal = document.getElementById('settingsModal');
            const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
            const avatarPreview = document.getElementById('avatarPreview');
            const fullNameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            const avatarInput = document.getElementById('avatarInput');
            const avatarLabel = document.getElementById('avatarLabel');
            const profileForm = document.getElementById('profileForm');
            const saveChangesBtn = document.getElementById('saveChangesBtn');

            const profileModal = document.getElementById('profileModal');
            const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
            const viewProfileBtn = document.getElementById('viewProfileBtn');
            const modalProfileAvatar = document.getElementById('modalProfileAvatar');
            const modalProfileName = document.getElementById('modalProfileName');
            const modalProfileUsername = document.getElementById('modalProfileUsername');
            const modalProfileEmail = document.getElementById('modalProfileEmail');
            const modalProfileRollNo = document.getElementById('modalProfileRollNo');
            const modalProfileDepartment = document.getElementById('modalProfileDepartment');
            const modalProfileYear = document.getElementById('modalProfileYear');

            function setupDashboard() {
                dashboardUsernames.forEach(el => el.textContent = user.FullName);
                dashboardAvatars.forEach(el => el.src = user.avatar || 'public/placeholder.png');
                if (profileCardName) profileCardName.textContent = user.FullName;
            }
            setupDashboard();

            function getApiUrl(path) { 
                 //this is for backend before live the backend folder of the project on server(render)

            //   return `http://localhost:3000/api/v1/users${path}`;
                // this is for backend before live the backend folder of the project on server(render)

                return `https://edu-nnect-4.onrender.com/api/v1/users${path}`; 
            }

            // --- Settings Modal Logic ---
            function openSettingsModal() { populateForm(user); settingsModal.classList.remove('hidden'); }
            function closeSettingsModal() { settingsModal.classList.add('hidden'); }
            function populateForm(userData) {
                avatarPreview.src = userData.avatar || 'public/placeholder.png';
                fullNameInput.value = userData.FullName || '';
                emailInput.value = userData.email || '';
            }
            if (settingsBtn) { settingsBtn.addEventListener('click', (e) => { e.preventDefault(); openSettingsModal(); }); }
            if (closeSettingsModalBtn) { closeSettingsModalBtn.addEventListener('click', closeSettingsModal); }
            settingsModal.addEventListener('click', (e) => e.target === settingsModal && closeSettingsModal());
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const originalButtonText = saveChangesBtn.innerHTML;
                saveChangesBtn.disabled = true;
                saveChangesBtn.innerHTML = `${loaderIcon} <span>Saving...</span>`;
                const updatedData = { FullName: fullNameInput.value, email: emailInput.value };
                try {
                    const response = await axios.patch(getApiUrl('/updateUserProfile'), updatedData, { headers: { 'Authorization': `Bearer ${token}` } });
                    user = { ...user, ...response.data.data };
                    localStorage.setItem('user', JSON.stringify(user));
                    alert('Profile updated successfully!');
                    setupDashboard();
                    closeSettingsModal();
                } catch (error) {
                    alert(`Error: ${error.response?.data?.message || 'Update failed'}`);
                } finally {
                    saveChangesBtn.disabled = false;
                    saveChangesBtn.innerHTML = originalButtonText;
                }
            });
            avatarInput.addEventListener('change', async () => {
                const file = avatarInput.files[0];
                if (!file) return;
                const originalLabelText = avatarLabel.innerHTML;
                avatarLabel.style.pointerEvents = 'none';
                avatarLabel.innerHTML = `${loaderIcon} <span>Uploading...</span>`;
                const formData = new FormData();
                formData.append('avatar', file);
                try {
                    const response = await axios.patch(getApiUrl('/update-avatar'), formData, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
                    user = { ...user, avatar: response.data.data.avatar };
                    localStorage.setItem('user', JSON.stringify(user));
                    alert('Avatar updated successfully!');
                    avatarPreview.src = user.avatar;
                    setupDashboard();
                } catch (error) {
                    alert(`Error: ${error.response?.data?.message || 'Upload failed'}`);
                } finally {
                    avatarLabel.style.pointerEvents = 'auto';
                    avatarLabel.innerHTML = originalLabelText;
                }
            });

            // --- Profile Modal Logic ---
            function openProfileModal() { populateProfileModal(user); profileModal.classList.remove('hidden'); }
            function closeProfileModal() { profileModal.classList.add('hidden'); }
            function populateProfileModal(userData) {
                if (!userData) return;
                modalProfileAvatar.src = userData.avatar || 'public/placeholder.png';
                modalProfileName.textContent = userData.FullName || 'Student Name';
                modalProfileUsername.textContent = userData.Username || 'username';
                modalProfileEmail.textContent = userData.email || 'N/A';
                modalProfileRollNo.textContent = userData.rollno || 'N/A';
                modalProfileDepartment.textContent = userData.department || 'Not Specified';
                modalProfileYear.textContent = `${userData.year || 'N/A'} Year`;
            }
            if (viewProfileBtn) { viewProfileBtn.addEventListener('click', openProfileModal); }
            if (closeProfileModalBtn) { closeProfileModalBtn.addEventListener('click', closeProfileModal); }
            profileModal.addEventListener('click', (e) => e.target === profileModal && closeProfileModal());
            
            // --- Logout Logic ---
            if (logoutBtn) { logoutBtn.addEventListener('click', async (e) => { e.preventDefault(); try { await axios.post(getApiUrl('/logout'), {}, { headers: { 'Authorization': `Bearer ${token}` } }); } catch (error) { console.error("Server logout failed", error); } finally { localStorage.clear(); window.location.href = 'singin.html'; } }); }
        });
    