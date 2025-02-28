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
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #142432; margin-bottom: 20px;">Travel Order Information</h2>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <p style="color: #6c757d; margin: 0;">Order Reference</p>
            <p style="font-weight: bold; margin: 5px 0 15px 0;">#${order.id}</p>
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
            <div style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-top: 20px;">
              <h3 style="color: #142432; margin-bottom: 15px;">Order Summary</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div>
                  <p style="color: #6c757d; margin: 0;">Identifier Code</p>
                  <p style="font-weight: bold; margin: 5px 0;">${travelOrder.identifierCode}</p>
                </div>
                <div>
                  <p style="color: #6c757d; margin: 0;">Number of Travellers</p>
                  <p style="font-weight: bold; margin: 5px 0;">${travelOrder.numberOfTravellers}</p>
                </div>
                <div>
                  <p style="color: #6c757d; margin: 0;">Hotel Included</p>
                  <p style="font-weight: bold; margin: 5px 0;">${travelOrder.isHotel ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p style="color: #6c757d; margin: 0;">Transfer Included</p>
                  <p style="font-weight: bold; margin: 5px 0;">${travelOrder.isTransfer ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          `;

              // Flight Information Bölümü
              if (travelOrder.flightInfo) {
                document.body.innerHTML += `
            <div style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-top: 20px;">
              <h3 style="color: #142432; margin-bottom: 15px;">Flight Information</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div>
                  <p style="color: #6c757d; margin: 0;">Arrival Date</p>
                  <p style="font-weight: bold; margin: 5px 0;">${new Date(travelOrder.flightInfo.arrivalDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style="color: #6c757d; margin: 0;">Return Date</p>
                  <p style="font-weight: bold; margin: 5px 0;">${new Date(travelOrder.flightInfo.returnDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style="color: #6c757d; margin: 0;">Departure Airport</p>
                  <p style="font-weight: bold; margin: 5px 0;">${travelOrder.flightInfo.departureAirport}</p>
                </div>
                <div>
                  <p style="color: #6c757d; margin: 0;">Arrival Airport</p>
                  <p style="font-weight: bold; margin: 5px 0;">${travelOrder.flightInfo.arrivalAirport}</p>
                </div>
                <div>
                  <p style="color: #6c757d; margin: 0;">Airline</p>
                  <p style="font-weight: bold; margin: 5px 0;">${travelOrder.flightInfo.airline}</p>
                </div>
                <div>
                  <p style="color: #6c757d; margin: 0;">Flight Number</p>
                  <p style="font-weight: bold; margin: 5px 0;">${travelOrder.flightInfo.flightNumber}</p>
                </div>
              </div>
            </div>
          `;
              }

              // Traveller Information Bölümü
              if (travelOrder.travellers && travelOrder.travellers.length > 0) {
                document.body.innerHTML += `
            <div style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-top: 20px;">
              <h3 style="color: #142432; margin-bottom: 15px;">Traveller Information</h3>
            `;

                travelOrder.travellers.forEach((traveller) => {
                  document.body.innerHTML += `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; border-bottom: 1px solid #e9ecef; padding-bottom: 10px; margin-bottom: 10px;">
                  <div>
                    <p style="color: #6c757d; margin: 0;">Full Name</p>
                    <p style="font-weight: bold; margin: 5px 0;">${traveller.name} ${traveller.surname}</p>
                  </div>
                  <div>
                    <p style="color: #6c757d; margin: 0;">Email Address</p>
                    <p style="font-weight: bold; margin: 5px 0;">${traveller.email}</p>
                  </div>
                  <div>
                    <p style="color: #6c757d; margin: 0;">Phone Number</p>
                    <p style="font-weight: bold; margin: 5px 0;">${traveller.phone}</p>
                  </div>
                  <div>
                    <p style="color: #6c757d; margin: 0;">Passport Number</p>
                    <p style="font-weight: bold; margin: 5px 0;">${traveller.passportNumber}</p>
                  </div>
                  <div>
                    <p style="color: #6c757d; margin: 0;">Birth Date</p>
                    <p style="font-weight: bold; margin: 5px 0;">${new Date(traveller.birthdate).toLocaleDateString()}</p>
                  </div>
                </div>
              `;
                });

                document.body.innerHTML += `</div>`;
              }
            } else {
              console.error("No travel order found for this order");
              document.body.innerHTML += `
                    <div style="padding: 20px; color: red;">
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
