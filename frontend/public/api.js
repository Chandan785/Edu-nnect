 

const api = axios.create();

// Interceptor to add the token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle expired token errors
api.interceptors.response.use(
    (response) => {
        // If the response is successful, just return it
        return response;
    },
    (error) => {
        // Check if the error is because of an expired token (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Clear user data from local storage
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userType');

            // Redirect to the login page
            alert('Your session has expired. Please log in again.');
            window.location.href = 'singin.html';
        }

        // For all other errors, just pass them on
        return Promise.reject(error);
    }
);