$(document).ready(function () {
    let customerCount = 0;
    const maxCustomers = 10;
    const customerBrands = ["Porsche", "Audi"];

    function generateCustomer(n) {
        const brand = customerBrands[Math.floor(Math.random() * customerBrands.length)];
        const customer = $("<div>")
            .addClass("draggable customer")
            .attr("id", "cust" + n)
            .attr("draggable", "true")
            .attr("data-brand", brand.toLowerCase())
            .text("Customer: " + brand + " " + n);
        $(".left").append(customer);
    }

    const interval = setInterval(() => {
        if ($(".left .customer").length < maxCustomers) {
        customerCount++;
        generateCustomer(customerCount);
        }
        if (customerCount >= maxCustomers) clearInterval(interval);
    }, 2000);

    // Dragging customer only
    $(document).on("dragstart", ".customer", function (e) {
        const id = $(this).attr("id");
        e.originalEvent.dataTransfer.setData("text/plain", id);
        console.log("Dragging customer:", id);
    });

    // Drop customer to correct brand section
    $(".customer-drop").on("dragover", function (e) {
        e.preventDefault();
    });

    $(".customer-drop").on("drop", function (e) {
        e.preventDefault();
        const customerId = e.originalEvent.dataTransfer.getData("text/plain");
        const $customer = $("#" + customerId);

        const brand = $(this).data("brand");
        if ($customer.data("brand") === brand) {
        const customerBox = $("<div>")
            .addClass("customer-box")
            .attr("draggable", "true")
            .attr("id", "pair" + customerId)
            .text("🚗 " + brand.toUpperCase() + " + " + $customer.text());

        $(this).closest(".brand-drop").append(customerBox);
        $customer.remove();

        // Topup customer
        if ($(".left .customer").length < maxCustomers) {
            customerCount++;
            generateCustomer(customerCount);
        }
        } else {
            alert("Customer only wants a " + $customer.data("brand"));
        }
    });

    // Drag full car+customer box to payment
    $(document).on("dragstart", ".customer-box", function (e) {
        e.originalEvent.dataTransfer.setData("text/plain", $(this).attr("id"));
    });

    $(".payment-drop").on("dragover", function (e) {
        e.preventDefault();
    });

    $(".payment-drop").on("drop", function (e) {
        e.preventDefault();
        const boxId = e.originalEvent.dataTransfer.getData("text/plain");
        const $box = $("#" + boxId);
        $(".payment-drop").append($box);
    });
});
