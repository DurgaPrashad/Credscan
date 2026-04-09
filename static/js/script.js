const overviewProcessing = document.getElementById("overview-processing");
const overviewDesc = document.getElementById("overview-desc");
const successMsg = document.getElementById("success-message");
const overviewMetrics = document.getElementById("overview-metrics");
const fileInfo = document.getElementById("file-info");
const fileName = document.getElementById("file-name");

document.getElementById("csvFile").addEventListener("change", function (e) {
  if (!e.target.files.length) return;
  
  // Show file name
  if (fileInfo && fileName) {
    fileName.textContent = e.target.files[0].name;
    fileInfo.style.display = "flex";
  }
  
  overviewProcessing.classList.add("active");
  
  setTimeout(() => {
    Papa.parse(e.target.files[0], {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;
        localStorage.setItem("creditcard_csv_data", JSON.stringify(data));
        showSuccessMessage();
        updateOverview(data);
        overviewProcessing.classList.remove("active");
      },
    });
  }, 100);
});

function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("open");
}

// Close sidebar when clicking outside
document.addEventListener("click", function (event) {
  const sidebar = document.querySelector(".sidebar");
  const menuToggle = document.querySelector(".menu-toggle");

  if (
    sidebar &&
    menuToggle &&
    !sidebar.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    sidebar.classList.remove("open");
  }
});

// Handle window resize
window.addEventListener("resize", function () {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar && window.innerWidth >= 1200) {
    sidebar.classList.remove("open");
  }
});

function showSuccessMessage() {
  successMsg.classList.add('show');
  successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Data uploaded and processed successfully!';
  setTimeout(() => {
    successMsg.classList.remove('show');
  }, 5000);
}

// Overview metrics
function updateOverview(data) {
  const total = data.length;
  const frauds = data.filter((row) => row["Class"] === 1).length;
  const legit = total - frauds;
  
  // Update stat cards
  document.getElementById('total-transactions').textContent = total.toLocaleString();
  document.getElementById('fraud-count').textContent = frauds.toLocaleString();
  document.getElementById('safe-count').textContent = legit.toLocaleString();
  
  // Update stat changes
  const fraudRate = ((frauds / total) * 100).toFixed(2);
  const safeRate = ((legit / total) * 100).toFixed(2);
  document.getElementById('fraud-change').textContent = `${fraudRate}% of total`;
  document.getElementById('safe-change').textContent = `${safeRate}% of total`;
  document.getElementById('total-change').textContent = 'Data loaded successfully';
  
  overviewMetrics.innerHTML = `
        <ul>
          <li>
            <strong>Total Transactions:</strong>
            <span>${total.toLocaleString()}</span>
          </li>
          <li>
            <strong>Fraudulent Transactions:</strong>
            <span style="color: #ff6b9d; font-weight: 600;">${frauds.toLocaleString()}</span>
          </li>
          <li>
            <strong>Legitimate Transactions:</strong>
            <span style="color: #667eea; font-weight: 600;">${legit.toLocaleString()}</span>
          </li>
          <li>
            <strong>Fraud Rate:</strong>
            <span style="color: #ff6b9d; font-weight: 600;">${fraudRate}%</span>
          </li>
          <li>
            <strong>Safety Rate:</strong>
            <span style="color: #667eea; font-weight: 600;">${safeRate}%</span>
          </li>
        </ul>
      `;
}


// Drag and Drop functionality
const uploadArea = document.getElementById('upload-area');
const csvFileInput = document.getElementById('csvFile');

if (uploadArea) {
  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  // Highlight drop area when item is dragged over it
  ['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, unhighlight, false);
  });

  // Handle dropped files
  uploadArea.addEventListener('drop', handleDrop, false);
  
  // Handle click to upload
  uploadArea.addEventListener('click', () => {
    csvFileInput.click();
  });
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  uploadArea.style.borderColor = '#764ba2';
  uploadArea.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)';
}

function unhighlight(e) {
  uploadArea.style.borderColor = '#667eea';
  uploadArea.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)';
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length > 0) {
    csvFileInput.files = files;
    const event = new Event('change', { bubbles: true });
    csvFileInput.dispatchEvent(event);
  }
}
