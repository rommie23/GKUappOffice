
// const convertUTCToIST = (utcDateString) => {
//     const date = new Date(utcDateString);

//     const dd = String(date.getDate()).padStart(2, '0');
//     const mm = String(date.getMonth() + 1).padStart(2, '0'); // January = 0
//     const yyyy = date.getFullYear();

//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');

//     return `${dd}-${mm}-${yyyy} ${hours}:${minutes}:${seconds}`;
// };
const convertUTCToIST = (utcDateString) => {
    // Convert UTC string to Date object
    const date = new Date(utcDateString);

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January = 0
    const yyyy = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // AM/PM conversion
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert 0 → 12 for 12 AM

    return `${dd}-${mm}-${yyyy} ${hours}:${minutes} ${ampm}`;
};

function formatIndianNumber(amount) {
  if (amount === null || amount === undefined || amount === '') return '';
  if (isNaN(amount)) return '';

  console.log("amount::",amount);
  
  const number = amount.toString().split('.');
  let lastThree = number[0].slice(-3);
  const otherNumbers = number[0].slice(0, -3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return number.length > 1 ? formatted + '.' + number[1] : formatted;
}

export {convertUTCToIST, formatIndianNumber};