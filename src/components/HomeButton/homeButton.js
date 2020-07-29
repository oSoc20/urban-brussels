const HomeButton = {
  displayHomeButton: (container) => {
    document.getElementById(container).innerHTML = /* html */ `
          
          
        <button class="btn home_button" id="home_btn">
          <div class="btn-hover-div">
          <svg width="46" height="38" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 27.5" version="1.1" x="0px" y="0px">
            <path class="home_svg" d="M13.9999587,16 C13.995004,15.4384685 13.5450107,15 12.9906311,15 L11.0093689,15 C10.4465275,15 10.0049766,15.4468553 10.0000418,16 L10,12 L14,12 L14,16 Z M11.2941457,0.705854259 C11.6839783,0.316021716 12.320971,0.320971012 12.7058543,0.705854259 L22.5881603,10.5881603 C23.3678979,11.3678979 23.1029738,12 21.9950534,12 L2.00494659,12 C0.897645164,12 0.628276527,11.3717235 1.41183966,10.5881603 L11.2941457,0.705854259 Z M3,12 L10,12 L10,21.0046024 C10,21.5543453 9.56211865,22 8.99707067,22 L4.00292933,22 C3.44902676,22 3,21.5443356 3,21.0046024 L3,12 Z M14,12 L21,12 L21,21.0046024 C21,21.5543453 20.5621186,22 19.9970707,22 L15.0029293,22 C14.4490268,22 14,21.5443356 14,21.0046024 L14,12 Z"/>
          </svg>
          </div>
        </button> 
        `
  },
  clickHandlerHomeBtn: () => {
    document.getElementById('home_btn').addEventListener('click', () => {
      window.location.href = '/#'
    })
  }
}
export default HomeButton
