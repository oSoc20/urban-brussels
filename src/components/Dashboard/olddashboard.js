import Api from '../api.js'
const Dashboard = {
    render: async () => {
        const view = /* html */`
              <section class="section">
                  <h1> Dashboard page </h1>
              </section>
              <div class="ct-chart .ct-perfect-fourth" class="architect">
              </div>
          `
        return view
    },
    after_render: async () => {
        let archButton = document.getElementById('next_architects');
        let data = await Api.getStats();
        let architectArray = [];
        let valueArray = [];

        let arr = Object.entries(data.BuildingsPerIntervenant);

        for (let index = 0; index < 10; index++) {
            architectArray[index] = Object.keys(data.BuildingsPerIntervenant)[index];
            valueArray[index] = Object.values(data.BuildingsPerIntervenant)[index];
        }

        let bar = new Chartist.Bar('.ct-chart', {
            labels: architectArray,
            series: [
                valueArray
            ]
          }, {
            seriesBarDistance: 10,
            reverseData: true,
            horizontalBars: true,
            axisY: {
              offset: 100
            }
          });

        /* update test
        archButton.addEventListener("click", () => {
            let test = [ "COgel", "dez", "u", "ANT", "AL", "RET", "PAEPE", "DUJARDIN", "MAGOSSE", "VERHELLE" ]
            bar.update({labels : test})
        })*/


    },

    sortFunction : (a, b) => {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    }

}

export default Dashboard
