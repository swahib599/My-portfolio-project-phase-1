const apiUrl = 'http://localhost:3000/experiences';

document.addEventListener('DOMContentLoaded', () => {
  fetchExperiences();

  document.getElementById('add-experience-btn').addEventListener('click', () => {
    openModal('add-modal');
  });

  document.getElementById('add-experience-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const experience = {
      company: document.getElementById('company').value,
      position: document.getElementById('position').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      location: document.getElementById('location').value,
      responsibilities: document.getElementById('responsibilities').value.split(',').map(item => item.trim())
    };
    addExperience(experience);
  });

  document.getElementById('edit-experience-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('edit-id').value;
    const updatedExperience = {
      company: document.getElementById('edit-company').value,
      position: document.getElementById('edit-position').value,
      startDate: document.getElementById('edit-startDate').value,
      endDate: document.getElementById('edit-endDate').value,
      location: document.getElementById('edit-location').value,
      responsibilities: document.getElementById('edit-responsibilities').value.split(',').map(item => item.trim())
    };
    updateExperience(id, updatedExperience);
  });

  document.getElementById('close-add-modal').addEventListener('click', () => {
    closeModal('add-modal');
  });

  document.getElementById('close-edit-modal').addEventListener('click', () => {
    closeModal('edit-modal');
  });
});

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

async function fetchExperiences() {
  try {
    const response = await fetch(apiUrl);
    const experiences = await response.json();
    displayExperiences(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
  }
}

function displayExperiences(experiences) {
  const container = document.getElementById('experience-container');
  container.innerHTML = '';

  experiences.forEach(exp => {
    const expElement = document.createElement('div');
    expElement.className = 'experience-item';
    expElement.innerHTML = `
      <h3>${exp.company}</h3>
      <h4>${exp.position}</h4>
      <p>${exp.startDate} - ${exp.endDate}</p>
      <p>${exp.location}</p>
      <ul>
        ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
      </ul>
      <button onclick="openEditModal(${exp.id})">Edit</button>
      <button onclick="deleteExperience(${exp.id})">Delete</button>
    `;
    container.appendChild(expElement);
  });
}

async function addExperience(experience) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(experience)
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    closeModal('add-modal');
    fetchExperiences();
  } catch (error) {
    console.error('Error adding experience:', error);
  }
}

async function updateExperience(id, updatedExperience) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedExperience)
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    closeModal('edit-modal');
    fetchExperiences();
  } catch (error) {
    console.error('Error updating experience:', error);
  }
}

async function deleteExperience(id) {
  if (confirm('Are you sure you want to delete this experience?')) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }

      fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  }
}

function openEditModal(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(experience => {
      document.getElementById('edit-id').value = experience.id;
      document.getElementById('edit-company').value = experience.company;
      document.getElementById('edit-position').value = experience.position;
      document.getElementById('edit-startDate').value = experience.startDate;
      document.getElementById('edit-endDate').value = experience.endDate;
      document.getElementById('edit-location').value = experience.location;
      document.getElementById('edit-responsibilities').value = experience.responsibilities.join(', ');
      openModal('edit-modal');
    })
    .catch(error => console.error('Error fetching experience for edit:', error));
}
