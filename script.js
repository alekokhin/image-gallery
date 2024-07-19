// Function to create the gallery
const createGallery = (data) => {
  const gallery = document.getElementById("gallery");

  // Group responses by URL
  const groupedData = data.data.reduce((acc, item) => {
    if (!acc[item.url]) {
      acc[item.url] = [];
    }
    acc[item.url].push(item.response.replace(/\\n/g, "<br>"));
    return acc;
  }, {});

  // Create gallery items
  for (const [url, responses] of Object.entries(groupedData)) {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";

    const img = document.createElement("img");
    img.src = url;
    galleryItem.appendChild(img);
    

    responses.forEach((response, index) => {
      const responseDiv = document.createElement("div");
      responseDiv.className = "response";
      responseDiv.innerHTML = response;
      galleryItem.appendChild(responseDiv);

      // Add an <hr> after each response except the last one
      if (index < responses.length - 1) {
        const hr = document.createElement("hr");
        hr.style.border = "0";
        hr.style.borderTop = "1px solid #ccc";
        hr.style.margin = "10px 0";
        galleryItem.appendChild(hr);
      }
    });

    gallery.appendChild(galleryItem);
  }
};

// Function to convert data to CSV format
const convertToCSV = (objArray) => {
  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
  let str = "";
  let row = "";

  // Extract the headers
  for (const index in array[0]) {
    if (row !== "") row += ",";
    row += index;
  }
  str += row + "\r\n";

  // Extract the data rows
  for (let i = 0; i < array.length; i++) {
    let line = "";
    for (const index in array[i]) {
      if (line !== "") line += ",";
      line += array[i][index];
    }
    str += line + "\r\n";
  }
  return str;
};

// Function to download the CSV file
const downloadCSV = (csv, filename) => {
  const csvFile = new Blob([csv], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
};

// Fetch data from the JSON file and create the gallery
fetch("result1.json")
  .then((response) => response.json())
  .then((data) => {
    createGallery(data);

    // Set up CSV download button
    const downloadButton = document.getElementById("downloadCsv");
    downloadButton.addEventListener("click", () => {
      const csvData = convertToCSV(data);
      downloadCSV(csvData, "data.csv");
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
