// js/address.js

async function getAddresses() {
  try {
    const token = localStorage.getItem("chiccharm_token");
    // Use http://localhost:5000/api/addresses instead of /api/addresses if running frontend separately
    const response = await fetch("http://localhost:5000/api/addresses", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Failed to load addresses from server");
    return await response.json();
  } catch (err) {
    console.error("Error fetching addresses:", err);
    return [];
  }
}

// js/address.js

async function addAddress(newAddress) {
  try {
    const token = localStorage.getItem("chiccharm_token");
    
    // Make sure 'addresses' is plural with an 's'
    const response = await fetch("/api/addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newAddress)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to save address: ${response.status} ${errText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error adding address:", err);
    alert(err.message);
  }
}

// js/address.js

async function removeAddress(addressId) {
  try {
    const token = localStorage.getItem("chiccharm_token");
    
    const response = await fetch(`/api/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || "Failed to delete address");
    }

    return true;
  } catch (err) {
    console.error("Error deleting address:", err);
    alert(err.message);
    throw err;
  }
}