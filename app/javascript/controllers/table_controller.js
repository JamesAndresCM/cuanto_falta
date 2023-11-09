import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
  static targets = ["table", "search", "name", "button"]
  
  checkEnterKey(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.loadData();
    }
  }

  handleKeyPress(event) {
    if (event.key === "Enter" && !this.buttonTarget.disabled) {
      this.loadData();
    }
  }

  checkInput() {
    const input = this.searchTarget;
    const button = this.buttonTarget;

    if (input.value.trim() === "") {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  }

  loadData() {
    const loader = document.getElementById("loader");
    loader.style.display = "block";
    const inputValue = this.searchTarget.value.trim();
    const url = `https://api.xor.cl/red/bus-stop/${inputValue}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        loader.style.display = "none";
        this.renderTable(data);
        this.setName(data);
      })
      .catch(error => {
        console.error("Error:", error);
        loader.style.display = "none";
      }
    );
  }


  setName(data) {
    document.querySelector("span").innerHTML = `Paradero: ${data.name}`
  }

  renderTable(data) {
    const table = document.querySelector("table");
    const tbody = table.querySelector("tbody");

    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }


  const columns = data.services
    .filter(service => service.valid)
    .flatMap(service =>
      service.buses.map(bus => [service.id, bus.id, bus.meters_distance, bus.min_arrival_time, bus.max_arrival_time])
  );

  columns.forEach(column => {
    const row = document.createElement("tr");

    column.forEach((value, index) => {
      const cell = document.createElement("td");

      if (index == 2) {
        cell.textContent = `${value} mt`
      } else if (index == 3 || index == 4) {
        if (value == 0) {
          cell.textContent = "Ahora mismo!"
          cell.style.color = "red";
        } else {
          cell.textContent = `${value} minutes`
        }
      }
      else {
        cell.textContent = value;
      } 

      row.appendChild(cell);
    });

    tbody.appendChild(row);
    });
  }
 }
