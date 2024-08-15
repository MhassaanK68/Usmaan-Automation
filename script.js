    let apiLoader = document.getElementById("api-loader")
    apiLoader.style.display = "table"

    $.ajax({
        type: "GET",
        url: "https://script.google.com/macros/s/AKfycbz2c-mDu4Ebcu_NSvYABdUNJhq0xR2viSpyevWmtdwsbBO0m1R8_axIbI_HHx6O4J3A/exec",
        data: { "data": "check" },
        success: function (data) {
            // Hide the loading indicator once the data is fetched

            let PendingClients = 0;

            for (var i = 1; i < data.content.length; i++) {

                let element = data.content[i]


                if (element[20] != "Yes") {
                    PendingClients += 1
                    var option = document.createElement('li');
                    option.textContent = "ID:" + element[0] + " | Name: " + element[3];
                    option.className = "list-group-item"
                    document.getElementById("list").appendChild(option);
                }

                // let element = data.content[i];
                apiLoader.style.display = "table"
            }

            if (PendingClients == 0){
                var option = document.createElement('li');
                option.textContent = "All Greetings Are Sent!";
                option.className = "list-group-item"
                document.getElementById("list").appendChild(option);
            }

            document.getElementById("api-loader").style.display = "none"

        },
        error: function () {
            // Hide the loading indicator in case of an error as well
            console.log("An error occurred while fetching data.");
        }
    });


async function sendGreetingsSequentially(ids) {
    for (const id of ids) {
        const formData = new FormData();
        formData.append('Client-IDs', id);

        try {
            const response = await fetch('https://hooks.zapier.com/hooks/catch/17094576/24wfr35/', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log("zapier request data: ", data)
        } catch (error) {
            console.error(`Error sending message for ID: ${id}`, error);
        }
    }
    console.log("All messages sent.");
}

document.getElementById('Client-IDs-Form').addEventListener('submit', async function (event) {
    event.preventDefault();

    
    const inputString = document.getElementById('Client-IDs').value;
    if (inputString == ""){return}
    const trimmedArray = inputString.split(',').map(id => id.trim());

    // Hide the greeting body and show the loader
    document.getElementById("Greeting-Body").style.display = "none";

    let loader = document.getElementById('loading')
    // Ensure the loader is visible
    loader.style.display = "table";

    try {
        // Wait for the sendGreetingsSequentially function to complete
        await sendGreetingsSequentially(trimmedArray);
    } finally {

       setTimeout(() => {  

       // Hide the loader and show the greeting body
       loader.style.display = "none";
       document.getElementById("Greeting-Body").style.display = "block";
       
       // Hide the modal
       $('#GreetingsMenu').modal("hide");
       location.reload()
    }, 2000);
        
    }
});
