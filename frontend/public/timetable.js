// Global data
let allTeachers = [];
let allDepartments = [];

// DOM elements
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("results");
const welcomeMessage = document.getElementById("welcomeMessage");

// Teacher Name search elements
const teacherContainer = document.getElementById("teacher-container");
const teacherNameInput = document.getElementById("teacherNameInput");
const teacherNameDropdown = document.getElementById("teacherNameDropdown");

// Department search elements
const departmentContainer = document.getElementById("department-container");
const departmentSearchInput = document.getElementById("departmentSearch");
const departmentDropdown = document.getElementById("departmentDropdown");

// Modal elements
const modal = document.getElementById("timetableModal");
const modalContent = document.getElementById("modalContent");
const timetableContainer = document.getElementById("timetableContainer");
const modalTeacherName = document.getElementById("modalTeacherName");

/**
 * -----------------------------------------------------
 * Initial Data Loading and Setup
 * -----------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', fetchAndSetup);

async function fetchAndSetup() {
  try {
    const response = await fetch('teachers.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    allTeachers = await response.json();
    
    // Populate both searchable dropdowns
    populateTeacherNameDropdown();
    
    allDepartments = [...new Set(allTeachers.map(teacher => teacher.department))].sort();
    populateDepartmentDropdown();

  } catch (error) {
    console.error("Could not fetch teacher data:", error);
    resultsDiv.innerHTML = `<p class="text-center text-red-600">Error loading teacher data.</p>`;
  }
}

/**
 * -----------------------------------------------------
 * Searchable Dropdown Logic
 * -----------------------------------------------------
 */

// NEW: Function to populate the teacher name dropdown
function populateTeacherNameDropdown() {
  teacherNameDropdown.innerHTML = '';
  allTeachers.forEach(teacher => {
    const optionDiv = document.createElement('div');
    optionDiv.textContent = teacher.name;
    optionDiv.className = 'p-3 hover:bg-indigo-100 cursor-pointer transition-all';
    
    optionDiv.addEventListener('click', () => {
      teacherNameInput.value = teacher.name;
      teacherNameDropdown.classList.add('hidden');
    });
    
    teacherNameDropdown.appendChild(optionDiv);
  });
}

// Function to populate the department dropdown
function populateDepartmentDropdown() {
  departmentDropdown.innerHTML = '';
  allDepartments.forEach(dept => {
    const optionDiv = document.createElement('div');
    optionDiv.textContent = dept;
    optionDiv.className = 'p-3 hover:bg-indigo-100 cursor-pointer transition-all';
    
    optionDiv.addEventListener('click', () => {
      departmentSearchInput.value = dept;
      departmentDropdown.classList.add('hidden');
    });
    
    departmentDropdown.appendChild(optionDiv);
  });
}

// Event listeners for the teacher name dropdown
teacherNameInput.addEventListener('focus', () => teacherNameDropdown.classList.remove('hidden'));
teacherNameInput.addEventListener('input', () => {
  const query = teacherNameInput.value.toLowerCase();
  const options = teacherNameDropdown.getElementsByTagName('div');
  for (let option of options) {
    option.style.display = option.textContent.toLowerCase().includes(query) ? '' : 'none';
  }
});

// Event listeners for the department dropdown
departmentSearchInput.addEventListener('focus', () => departmentDropdown.classList.remove('hidden'));
departmentSearchInput.addEventListener('input', () => {
  const query = departmentSearchInput.value.toLowerCase();
  const options = departmentDropdown.getElementsByTagName('div');
  for (let option of options) {
    option.style.display = option.textContent.toLowerCase().includes(query) ? '' : 'none';
  }
});

// Generic listener to hide dropdowns when clicking outside
document.addEventListener('click', (event) => {
  if (!departmentContainer.contains(event.target)) {
    departmentDropdown.classList.add('hidden');
  }
  if (!teacherContainer.contains(event.target)) {
    teacherNameDropdown.classList.add('hidden');
  }
});

/**
 * -----------------------------------------------------
 * Main Search and Display Logic
 * -----------------------------------------------------
 */
searchButton.addEventListener('click', performSearch);

function performSearch() {
  const nameQuery = teacherNameInput.value.toLowerCase().trim();
  const departmentQuery = departmentSearchInput.value.toLowerCase().trim();

  if (!nameQuery && !departmentQuery) {
    if (welcomeMessage) {
      resultsDiv.innerHTML = '';
      resultsDiv.appendChild(welcomeMessage);
    }
    return;
  }

  const filteredTeachers = allTeachers.filter(teacher => {
    const nameMatch = !nameQuery || teacher.name.toLowerCase().includes(nameQuery);
    const departmentMatch = !departmentQuery || teacher.department.toLowerCase().includes(departmentQuery);
    return nameMatch && departmentMatch;
  });

  displayResults(filteredTeachers);
}

function displayResults(teachers) {
  resultsDiv.innerHTML = "";
  if (teachers.length === 0) {
    resultsDiv.innerHTML = `<p class="text-center text-gray-600 py-10">No teachers found.</p>`;
    return;
  }
  const resultList = document.createElement('ul');
  resultList.className = 'space-y-4';
  teachers.forEach(teacher => {
    const listItem = document.createElement('li');
    listItem.className = 'bg-white p-4 rounded-lg shadow-md border flex justify-between items-center transition-all hover:shadow-lg hover:border-indigo-300';
    listItem.innerHTML = `<div class="flex items-center space-x-4"><div class="bg-indigo-100 text-indigo-600 rounded-full h-12 w-12 flex items-center justify-center"><i class="fa fa-user"></i></div><div><h3 class="text-lg font-semibold text-indigo-800">${teacher.name}</h3><p class="text-sm text-gray-600">${teacher.department}</p><p class="text-xs text-gray-500 font-medium mt-1"><i class="fa fa-map-marker-alt mr-1"></i> Cabin: ${teacher.cabin}</p></div></div><button onclick="showTimetable(${teacher.id})" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all">View Timetable</button>`;
    resultList.appendChild(listItem);
  });
  resultsDiv.appendChild(resultList);
}

/**
 * -----------------------------------------------------
 * Modal Logic (No changes here)
 * -----------------------------------------------------
 */
function showTimetable(teacherId) {
  const teacher = allTeachers.find(t => t.id === teacherId);
  if (!teacher) return;
  modalTeacherName.textContent = `Timetable - ${teacher.name}`;
  let tableHTML = `<table class="w-full border-collapse text-sm"><thead><tr class="bg-gray-200"><th class="p-3 border text-left">Day</th><th class="p-3 border">9:00 - 10:00</th><th class="p-3 border">10:00 - 11:00</th><th class="p-3 border">11:00 - 12:00</th></tr></thead><tbody>`;
  Object.keys(teacher.timetable).forEach((day, index) => {
    const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
    tableHTML += `<tr class="${bgColor}"><td class="p-3 border font-semibold">${day}</td>`;
    teacher.timetable[day].forEach(slot => {
      const activityColor = slot.activity.toLowerCase().includes('free') ? 'text-green-600' : 'text-gray-800';
      tableHTML += `<td class="p-3 border text-center"><div class="font-bold ${activityColor}">${slot.activity}</div><div class="text-xs text-gray-500 mt-1">${slot.location}</div></td>`;
    });
    tableHTML += `</tr>`;
  });
  tableHTML += `</tbody></table>`;
  timetableContainer.innerHTML = tableHTML;
  modal.classList.remove("hidden");
  setTimeout(() => { modalContent.classList.remove('scale-95', 'opacity-0'); }, 10);
}

function closeModal() {
  modalContent.classList.add('scale-95', 'opacity-0');
  setTimeout(() => { modal.classList.add("hidden"); }, 300);
}