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

getLocation();