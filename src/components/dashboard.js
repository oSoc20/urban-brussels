const Dashboard = {
  render: async () => {
    const view = /* html */`
              <section class="section">
                  <h1> Dashboard page </h1>
              </section>

    <section class="page-content">
        <section class="search-and-user">
                <form>
                <input type="search" placeholder="Search">
                <button type="submit" aria-label="submit form">
                    <svg aria-hidden="true">
                    <use xlink:href="#search"></use>
                    </svg>
                </button>
                </form>
                <div class="admin-profile">
                <span class="map"></span>
                <div class="notifications">
                        <span class="badge">1</span>
                        <svg>
                            <use xlink:href="#users"></use>
                        </svg>
                </div>
                </div>
            </section>
            <section class="grid">
                <article></article>
                <article></article>
                <article></article>
                <article></article>
                <article></article>
                <article></article>
                <article></article>
                <article></article>
            </section>
            <footer class="page-footer"></footer>
</section>
          `
    return view
  },
  after_render: async () => {
  }

}

export default Dashboard
