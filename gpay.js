/**
 * GOOGLE PAY INJECTOR - DARK RED FLUENT
 * Este script añade el botón de Google Pay dinámicamente.
 */

(function() {
    // 1. Inyectar el script de Google dinámicamente
    const gScript = document.createElement('script');
    gScript.src = "https://pay.google.com/gp/p/js/pay.js";
    gScript.async = true;
    gScript.onload = () => {
        const paymentsClient = new google.payments.api.PaymentsClient({
            environment: 'TEST' // Cambiar a 'PRODUCTION' para transacciones reales
        });

        const baseRequest = { apiVersion: 2, apiVersionMinor: 0 };
        const allowedCardNetworks = ["VISA", "MASTERCARD", "AMEX"];
        const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
        
        const baseCardPaymentMethod = {
            type: 'CARD',
            parameters: {
                allowedAuthMethods: allowedCardAuthMethods,
                allowedCardNetworks: allowedCardNetworks
            }
        };

        // Verificar si el usuario puede pagar con GPay
        paymentsClient.isReadyToPay(Object.assign({
            allowedPaymentMethods: [baseCardPaymentMethod]
        }, baseRequest)).then(response => {
            if (response.result) {
                // Crear el botón oficial
                const button = paymentsClient.createButton({
                    buttonColor: 'black',
                    buttonType: 'plain',
                    onClick: () => {
                        const paymentDataRequest = Object.assign({}, baseRequest);
                        paymentDataRequest.allowedPaymentMethods = [Object.assign({
                            tokenizationSpecification: {
                                type: 'PAYMENT_GATEWAY',
                                parameters: { 'gateway': 'example', 'gatewayMerchantId': 'example' }
                            }
                        }, baseCardPaymentMethod)];
                        paymentDataRequest.transactionInfo = {
                            totalPriceStatus: 'FINAL', totalPrice: '1.00', currencyCode: 'USD', countryCode: 'US'
                        };
                        paymentDataRequest.merchantInfo = { merchantName: 'Cyber Red Store' };
                        
                        paymentsClient.loadPaymentData(paymentDataRequest)
                            .then(data => alert("GOOGLE PAY: ACCESO CONCEDIDO"))
                            .catch(err => console.error(err));
                    }
                });

                // 2. Estilizar el botón para que encaje con el diseño FLUENT
                button.style.width = "100%";
                button.style.height = "50px";
                button.style.marginTop = "15px";
                button.style.borderRadius = "12px";
                button.style.cursor = "pointer";
                button.style.boxShadow = "0 8px 20px rgba(239, 68, 68, 0.1)";
                button.style.border = "1px solid rgba(239, 68, 68, 0.3)";
                button.style.transition = "transform 0.2s ease";

                // Efecto Hover vía JS
                button.onmouseover = () => button.style.transform = "translateY(-2px)";
                button.onmouseout = () => button.style.transform = "translateY(0)";

                // 3. Insertar el botón al final del formulario sin tocar el HTML
                const form = document.getElementById('payment-form');
                if (form) {
                    form.appendChild(button);
                }
            }
        });
    };
    document.head.appendChild(gScript);
})();