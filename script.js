$(document).ready(function () {
  let customerCount = 1;
  let totalSales = 0;
  const carPrice = 100000;

  const audiModels = ["Audi R8", "Audi A4", "Audi Q5", "Audi TT"];
  const porscheModels = ["Porsche 911", "Porsche Cayenne", "Porsche Taycan", "Porsche Panamera"];

  // Generate cars
  function generateCars(models, brand) {
    models.forEach(model => {
      const carDiv = $('<div>')
        .addClass('car-with-customer')
        .attr('draggable', 'true')
        .attr('data-brand', brand)
        .attr('data-model', model)
        .html(`<div class="car">${model}</div>`);
      $(`#${brand.toLowerCase()}-cars`).append(carDiv);
    });
  }

  generateCars(audiModels, 'Audi');
  generateCars(porscheModels, 'Porsche');

  // Generate customers every 2s until 10
  const customerInterval = setInterval(() => {
    if ($('#customer-queue .customer').length < 10) {
      const brand = Math.random() < 0.5 ? 'Audi' : 'Porsche';
      const cust = $('<div>')
        .addClass('customer')
        .attr('draggable', 'true')
        .attr('id', 'cust' + customerCount)
        .text(`Customer ${brand} ${customerCount}`);
      $('#customer-queue').append(cust);
      customerCount++;
    }
  }, 2000);

  // Drag start
  $(document).on('dragstart', '.customer, .car-with-customer', function (e) {
    e.originalEvent.dataTransfer.setData("text/plain", $(this).attr('id') || $(this).data('model'));
    e.originalEvent.dataTransfer.setData("type", $(this).hasClass('customer') ? 'customer' : 'car');
    $(this).addClass("dragging");
  });

  // Allow drop
  $('.customer-slot, #payment-area, #exit-area').on('dragover', function (e) {
    e.preventDefault();
  });

  // Drop customer into car
//   $('.customer-slot').on('drop', function (e) {
//     e.preventDefault();
//     const dragType = e.originalEvent.dataTransfer.getData("type");
//     const id = e.originalEvent.dataTransfer.getData("text/plain");
//     if (dragType === 'customer') {
//       const cust = $('#' + id);
//       const targetCar = $(this).find('.car-with-customer:not(:has(.customer))').first();
//       if (targetCar.length) {
//         targetCar.append(cust);
//       }
//     }
//   });

    // Drop customer directly into specific car
    $(document).on('dragover', '.car-with-customer', function (e) {
    e.preventDefault();
    });

    $(document).on('drop', '.car-with-customer', function (e) {
    e.preventDefault();
    const dragType = e.originalEvent.dataTransfer.getData("type");
    const id = e.originalEvent.dataTransfer.getData("text/plain");

    if (dragType === 'customer') {
        const cust = $('#' + id);
        // Check kalau kereta belum ada customer
        if ($(this).find('.customer').length === 0) {
        $(this).append(cust);
        }
    }
    });

  // Drop to payment
  $('#payment-area').on('drop', function (e) {
    e.preventDefault();
    const dragType = e.originalEvent.dataTransfer.getData("type");
    const id = e.originalEvent.dataTransfer.getData("text/plain");
    if (dragType === 'car') {
      const carDiv = $(`[data-model="${id}"]`);
      if (carDiv.find('.customer').length) {
        totalSales += carPrice;
        $('#sales-amount').text(totalSales.toLocaleString());
        carDiv.remove();
      }
    }
  });

  // Drop to exit
  $('#exit-area').on('drop', function (e) {
    e.preventDefault();
    const dragType = e.originalEvent.dataTransfer.getData("type");
    const id = e.originalEvent.dataTransfer.getData("text/plain");
    if (dragType === 'customer') {
      $('#' + id).remove();
    } else if (dragType === 'car') {
      const carDiv = $(`[data-model="${id}"]`);
      if (carDiv.find('.customer').length) {
        carDiv.find('.customer').remove();
      }
    }
  });
});
