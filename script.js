   //Retrieve data from a specific repository and dynamically generate a download card based on that information
   
   
    //Repo details
    var repoOwner = "fijopete";
    var repoName = "practice";

    //creating cards.
    //const headers = { Authorization: `token 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` };

    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents`
    //       , {
    //   headers
    // }
         )
      .then((response) => response.json())
      .then((data) => {

        const carouselContainer = document.querySelector(".carousel__container");

        data
          .filter((item) => item.type === "dir")
          .forEach((folder) => {
            const folderName = folder.name;
            const newItem = document.createElement("div");
            newItem.classList.add("carousel-item");
            const itemTitle = document.createElement("h2");
            itemTitle.classList.add("title-card");
            const cardHover = document.createElement("div");
            cardHover.classList.add("carousel-item__details");


            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button-container");
            const button = document.createElement("button");

            itemTitle.textContent = folderName;
            button.textContent = "Download";
            button.addEventListener("click", () =>
              downloadFolderContent(repoOwner , repoName, folderName)
            );

            cardHover.appendChild(buttonContainer);
            buttonContainer.appendChild(button);
            newItem.appendChild(itemTitle);
            newItem.appendChild(cardHover);
            carouselContainer.appendChild(newItem);
          });
      })
      .catch((error) =>
        console.error("Error fetching repository contents:", error)
      );



        async function downloadFolderContent(repoOwner, repoName, folderPath, currentFolderPath = '') {
          // Fetch contents of the folder from GitHub API
          const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`
          //                              , {
          //   headers
          // }
                                      );
          const contents = await response.json();
       
          // Loop through each item in the folder
          for (const item of contents) {
              if (item.type === 'file') {
                  // Download the file
                  const fileUrl = item.download_url;
                  const fileName = item.name; // Use the file name from GitHub
                  const filePath = `${currentFolderPath}/${fileName}`;
       
                  const fileResponse = await fetch(fileUrl);
                  const fileBlob = await fileResponse.blob();
       
                  // Create a Blob URL
                  const blobUrl = URL.createObjectURL(fileBlob);
       
                  // Create a temporary link element
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.setAttribute('download', filePath);
       
                  // Simulate click to trigger download
                  link.click();
       
                  // Clean up by revoking the Blob URL
                  URL.revokeObjectURL(blobUrl);
              } else if (item.type === 'dir') {
                  // Create directory if it doesn't exist
                const subfolderPath = `${currentFolderPath}/${item.name}`;
                await downloadFolderContent(repoOwner, repoName, `${folderPath}/${item.name}`, subfolderPath);
              }
          }
      }
      
      
