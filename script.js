// ตั้งค่าพื้นที่มหาวิทยาลัยศิลปากร วิทยาเขตเพชรบุรี
const map = L.map("map").setView([13.1056, 99.9474], 16);

// เพิ่มแผนที่พื้นหลัง (ฟรีจาก OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// โหลดหมุดจาก LocalStorage
let markers = JSON.parse(localStorage.getItem("markers") || "[]");
markers.forEach((m) => {
  L.marker(m).addTo(map);
});

// คลิกบนแผนที่เพื่อเพิ่มหมุดใหม่
map.on("click", (e) => {
  const { lat, lng } = e.latlng;
  L.marker([lat, lng]).addTo(map);
  markers.push([lat, lng]);
  localStorage.setItem("markers", JSON.stringify(markers));
});

// ฟังก์ชันหาตำแหน่งปัจจุบัน
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      L.marker([lat, lng], { title: "ตำแหน่งของฉัน" })
        .addTo(map)
        .bindPopup("📍 คุณอยู่ที่นี่")
        .openPopup();
      map.setView([lat, lng], 17);
    });
  } else {
    alert("ไม่สามารถใช้การระบุตำแหน่งได้");
  }
}

// ฟังก์ชันส่งออกหมุด
function exportMarkers() {
  const data = JSON.stringify(markers);
  navigator.clipboard.writeText(data);
  alert("คัดลอกหมุดไปยังคลิปบอร์ดแล้ว ✅");
}

// ฟังก์ชันนำเข้าหมุด
function importMarkers() {
  const data = prompt("วางข้อมูลหมุดที่ต้องการนำเข้า:");
  if (!data) return;
  try {
    const newMarkers = JSON.parse(data);
    newMarkers.forEach((m) => {
      L.marker(m).addTo(map);
      markers.push(m);
    });
    localStorage.setItem("markers", JSON.stringify(markers));
    alert("นำเข้าหมุดสำเร็จ ✅");
  } catch {
    alert("รูปแบบข้อมูลไม่ถูกต้อง ❌");
  }
}
