export const handleNumberInputChange = (input) => {
  const newValue = input.replace(/^[0]+/g, '').replace(/[^\d.]/g, '');
  const pointData = newValue.indexOf('.');
  if (pointData !== -1 && newValue.indexOf('.', pointData + 1) !== -1) {
    return newValue.slice(0, -1);
  }
  return newValue;
};

export const getDatesOfWeek = (weekNumber, month, year) => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const offset = 8 - dayOfWeek;
  const startOfWeek = new Date(firstDayOfMonth.getTime() + (offset + (weekNumber - 2) * 7) * 24 * 60 * 60 * 1000);
  const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
  const dates = [];
  for (let i = startOfWeek; i <= endOfWeek; i.setDate(i.getDate() + 1)) {
    dates.push(new Date(i));
  }
  return dates;
};

export const getFirstDayLastDayOfNextMonth = (numOfMonths, startDate = new Date()) => {
  const tmp = new Date(startDate);
  tmp.setMonth(tmp.getMonth() + numOfMonths);
  const firstDay = new Date(tmp.getFullYear(), tmp.getMonth(), 1);
  const lastDay = new Date(tmp.getFullYear(), tmp.getMonth() + 1, 0);
  return { firstDay, lastDay };
};

export const getMonth = (date) => {
  const newDate = new Date(date);
  const adjustedDate = newDate.getMonth();
  const prefixes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return prefixes[adjustedDate];
};

export const filterImgData = (img, type) => {
  if (type.includes('image')) {
    return img;
  }
  if (type.includes('pdf')) {
    return '/assets/icons/files/ic_pdf.svg';
  }
  return '/assets/icons/files/ic_video.svg';
};
