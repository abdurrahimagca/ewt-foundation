import { location, data } from "@shopware-ag/meteor-admin-sdk";
if (location.is("ce-traveller-view-tab-card")) {
  location.startAutoResizer();
  try {
    data
      .get({
        id: "sw-order-detail-base__order",
        selectors: ["id"],
      })
      .then((order) => {
        // Başlık ve Order ID Bilgisi
        document.body.innerHTML = `
        <div class="container">
          <h2 class="title">Travel Order Information</h2>
          <div class="order-reference">
            <p class="info-label">Order Reference</p>
            <p class="info-value">#${order.id}</p>
          </div>
        </div>`;

        // ce_travel_order_info Bilgilerini Çek
        const repository = data.repository("ce_travel_order_info");
        const criteria = new data.Classes.Criteria();
        criteria.addFilter(data.Classes.Criteria.equals("orderId", order.id));
        criteria.addAssociation("flightInfo");
        criteria.addAssociation("travellers");
        repository
          .search(criteria)
          .then((result) => {
            // console.log("Raw result:", result);

            if (result && result.first()) {
              const travelOrder = result.first();
              //   console.log("Travel Order:", travelOrder);

              // Order Summary Bölümü
              document.body.innerHTML += `
            <div class="info-card">
              <h3 class="title">Order Summary</h3>
              <div class="info-grid">
                <div>
                  <p class="info-label">Identifier Code</p>
                  <p class="info-value">${travelOrder.identifierCode}</p>
                </div>
                <div>
                  <p class="info-label">Number of Travellers</p>
                  <p class="info-value">${travelOrder.numberOfTravellers}</p>
                </div>
                <div>
                  <p class="info-label">Hotel Included</p>
                  <p class="info-value">${travelOrder.isHotel ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p class="info-label">Transfer Included</p>
                  <p class="info-value">${travelOrder.isTransfer ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          `;

              // Flight Information Bölümü
              if (travelOrder.flightInfo) {
                document.body.innerHTML += `
            <div class="info-card">
              <h3 class="title">Flight Information</h3>
              <div class="info-grid">
                <div>
                  <p class="info-label">Arrival Date</p>
                  <p class="info-value">${new Date(travelOrder.flightInfo.arrivalDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p class="info-label">Return Date</p>
                  <p class="info-value">${new Date(travelOrder.flightInfo.returnDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p class="info-label">Departure Airport</p>
                  <p class="info-value">${travelOrder.flightInfo.departureAirport}</p>
                </div>
                <div>
                  <p class="info-label">Arrival Airport</p>
                  <p class="info-value">${travelOrder.flightInfo.arrivalAirport}</p>
                </div>
                <div>
                  <p class="info-label">Airline</p>
                  <p class="info-value">${travelOrder.flightInfo.airline}</p>
                </div>
                <div>
                  <p class="info-label">Flight Number</p>
                  <p class="info-value">${travelOrder.flightInfo.flightNumber}</p>
                </div>
              </div>
            </div>
          `;
              }

              // Traveller Information Bölümü
              if (travelOrder.travellers && travelOrder.travellers.length > 0) {
                document.body.innerHTML += `
            <div class="info-card">
              <h3 class="title">Traveller Information</h3>
            `;

                travelOrder.travellers.forEach((traveller) => {
                  document.body.innerHTML += `
                <div class="traveller-item">
                  <div>
                    <p class="info-label">Full Name</p>
                    <p class="info-value">${traveller.name} ${traveller.surname}</p>
                  </div>
                  <div>
                    <p class="info-label">Email Address</p>
                    <p class="info-value">${traveller.email}</p>
                  </div>
                  <div>
                    <p class="info-label">Phone Number</p>
                    <p class="info-value">${traveller.phone}</p>
                  </div>
                  <div>
                    <p class="info-label">Passport Number</p>
                    <p class="info-value">${traveller.passportNumber}</p>
                  </div>
                  <div>
                    <p class="info-label">Birth Date</p>
                    <p class="info-value">${new Date(traveller.birthdate).toLocaleDateString()}</p>
                  </div>
                </div>
              `;
                });

                document.body.innerHTML += `</div>`;
              }
            } else {
              console.error("No travel order found for this order");
              document.body.innerHTML += `
                    <div class="error-message">
                      No travel order information found for this order.
                    </div>
                  `;
            }
          })
          .catch((error) => {
            console.error("Repository search error:", error);
          });
      });
  } catch (e) {
    console.error("Error:", e);
  }
}
