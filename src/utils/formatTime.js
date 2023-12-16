// noinspection JSCheckFunctionSignatures

import { format, formatDistanceToNow, getTime } from 'date-fns';
import vi from 'date-fns/locale/vi';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fddMMYYYYWithSlash(date) {
  return format(new Date(date), 'dd/MM/yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fTimestamp(date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: vi,
  });
}

export function getNextNDay(no) {
  const today = new Date();
  const nextDay = new Date(today);
  nextDay.setDate(nextDay.getDate() + no);
  return nextDay;
}

export function fDateToDay(date) {
  return format(new Date(date), 'dd');
}

export function fDateToYear(date) {
  return format(new Date(date), 'yyyy');
}

export function fDateToMonth(date) {
  return format(new Date(date), 'MM');
}

export function fDateToDayMonth(date) {
  return format(new Date(date), 'dd/MM');
}

export function getDateNextNMonth(date, no) {
  const nextMonth = new Date(date);
  nextMonth.setMonth(nextMonth.getMonth() + no);
  return nextMonth;
}

export function fMonthYear(date) {
  return format(new Date(date), 'MM/yyyy');
}

export function convertDateFormat(inputDate) {
  if (!inputDate) return null;
  const parts = inputDate.split('/');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function addOneMonth(inputDate) {
  const newDate = new Date(inputDate || '');
  newDate.setMonth(newDate.getMonth() + 1);

  return newDate;
}

export function addOneDay(inputDate) {
  const newDate = new Date(inputDate || '');
  newDate.setDate(newDate.getDate() + 1);

  return newDate;
}
