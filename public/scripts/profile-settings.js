// USER AVATAR 

const checkboxGroup = document.querySelectorAll('#img-box input[type="checkbox"]');

checkboxGroup.forEach(checkbox => checkbox.addEventListener('click', () => {
  const id = checkbox.id;
  checkboxGroup.forEach(checkbox => {
    if (checkbox.id !== id) checkbox.checked = false;
  });
  saveAvatar(checkbox.value);
}));

const saveAvatar = (avatar) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status == 200 && xhr.readyState == 4) {
      document.querySelector('.info-personal-avatar img').src = '/assets/profile-avatars/' + avatar + '.jpg';
      document.querySelector('img.profile-avatar').src = '/assets/profile-avatars/' + avatar + '.jpg';
    }
  };
  xhr.open('POST', '/profile-avatar');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send('avatar=' + avatar);
};

// USER LOCATION

const locationParagraph = document.getElementById('user-location-info');

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      locationParagraph.textContent = position;
    });
  } else {
    locationParagraph.textContent = 'geolocation is not supported.';
  }
};

// getLocation();