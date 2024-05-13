    //Repo details
    var repoOwner = "fijopete";
    var repoName = "practice";

    //To fetch folder names and create cards
    async function createCards(repoOwner, repoName) {
      try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents`);
   
          if (!response.ok) {
              throw new Error('Failed to fetch files');
          }
   
          const contents = await response.json();
          const carouselContainer = document.querySelector(".carousel__container");
   
          contents.filter((item) => item.type === "dir")
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
              downloadAndZipFiles(repoOwner, repoName, folderName)
            );

            cardHover.appendChild(buttonContainer);
            buttonContainer.appendChild(button);
            newItem.appendChild(itemTitle);
            newItem.appendChild(cardHover);
            carouselContainer.appendChild(newItem);
          });
      } catch (error) {
          console.error('Error:', error.message);
      }
  }

    //to download and make it to zip files
    async function downloadAndZipFiles(repoOwner, repoName, folderPath) {
        // Collect all file URLs
        const fileUrls = await getAllFileUrls(repoOwner, repoName, folderPath);
     
        // Create a zip file
        const zip = new JSZip();
     
        // Download each file and add it to the zip
        await Promise.all(fileUrls.map(async (fileUrl) => {
            const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            const fileResponse = await fetch(fileUrl);
            const fileBlob = await fileResponse.blob();
            zip.file(fileName, fileBlob);
        }));
     
        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' });
     
        // Create a link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.setAttribute('download', `${folderPath.replace(/\//g, '-')}.zip`);
     
        // Simulate click to trigger download
    link.click();
    }
    
    //to get all file urls for download
    async function getAllFileUrls(repoOwner, repoName, folderPath) {
        const fileUrls = [];
     
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
        const contents = await response.json();
     
            for (const item of contents) {
                if (item.type === 'file') {
                    fileUrls.push(item.download_url);
                } else if (item.type === 'dir') {
                  alert("An issue has been detected with the structure of the data folder, hence, downloading is currently not possible! ");
                  fileUrls = [];
                  break;
                }
            }

        return fileUrls;
    }
 
    createCards(repoOwner,repoName);
