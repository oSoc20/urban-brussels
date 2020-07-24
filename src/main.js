import Navbar from './components/Navbar/navbar.js'
import Landing from './components/Landing/landing.js'
import Dashboard from './components/Dashboard/dashboard.js'
import Detail from './components/BuildingDetail/buildingDetail.js'
import List from './components/BuildingsList/buildingslist.js'

import Utils from './utils.js'

// List of supported routes. Any url other than these routes will redirect to the home page
const routes = {
  '/': Landing,
  '/list': List,
  '/dashboard': Dashboard,
  '/detail': Detail
}

// The router code. Takes a URL, checks the list of supported routes and then renders the corresponding content page.
const router = async () => {
  // Lazy load view element:

  const header = null || document.getElementById('header_ctn')

  const content = null || document.getElementById('page_ctn')
  // const footer = null || document.getElementById('footer_ctn');

  // Render the Header and footer of the page

  header.innerHTML = await Navbar.render()
  await Navbar.after_render()

  // footer.innerHTML = await Bottombar.render();
  // await Bottombar.after_render();

  // Get the parsed URl from the addressbar
  const request = Utils.parseRequestURL()

  // Parse the URL and if it has an id part, change it with the string ":id"
  const parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')

  // Get the page from our hash of supported routes.
  // If the parsed URL is not in our list of supported routes, select the landing page instead
  const page = routes[parsedURL] ? routes[parsedURL] : Landing
  content.innerHTML = await page.render()
  await page.after_render()
}

// Listen on hash change:
window.addEventListener('hashchange', router)

// Listen on page load:
window.addEventListener('load', router)
