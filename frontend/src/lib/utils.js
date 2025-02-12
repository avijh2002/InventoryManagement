

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
  
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()]; 
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  };
  