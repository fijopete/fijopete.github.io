    var repoOwner = "fijopete";
    var repoName = "practice";
    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents`)
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
              downloadFolderFromGitHub(folderName)
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


      function downloadFolderFromGitHub(folderName) {
        console.log("clicked!")
        var repoOwner = "fijopete";
        var repoName = "practice";
        // var folderPath = "login";
        var folderPath = `${folderName}`;

        // Initialize JSZip
        var zip = new JSZip();

        // Create a promise for each file in the folder
        var promises = [];

        // Fetch each file in the folder
        fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`
        )
          .then((response) => response.json())
          .then((files) => {
            files.forEach((file) => {
              if (file.type === "file") {
                // Fetch file content
                promises.push(
                  fetch(file.download_url)
                    .then((response) => response.blob())
                    .then((blob) => {
                      // Add file to zip
                      zip.file(file.name, blob);
                    })
                );
              }
            });

            // Wait for all promises to resolve
            Promise.all(promises).then(() => {
              // Generate the zip file asynchronously
              zip.generateAsync({ type: "blob" }).then((blob) => {
                // Trigger the download
                saveAs(blob, `${folderPath.split("/").pop()}.zip`);
              });
            });
          });
      }
