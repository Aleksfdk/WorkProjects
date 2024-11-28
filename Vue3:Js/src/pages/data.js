import moment from "moment/moment";

export const dateDeclension = (date, title) => {    
  let dateTypes = ['день', 'дня', 'дней']
  let number = date
  if (title === 'months') {
      dateTypes = ['месяц', 'месяца', 'месяцев']
  }
  if (title === 'years') {
      dateTypes = ['год', 'года', 'лет']
  }

  number %= 100;
  if (number >= 5 && number <= 20) {
      return `${date} ${dateTypes[2]}`;
  }
  number %= 10;
  if (number === 1) {
      return `${date} ${dateTypes[0]}`;
  }
  if (number >= 2 && number <= 4) {
      return `${date} ${dateTypes[1]}`;
  }
  return `${date} ${dateTypes[2]}`;
}

export const ageСalculation = (birthdate, DATE_FORMAT) => {
  if (!birthdate) return;
  const years = moment().diff(moment(birthdate, DATE_FORMAT), 'year')
  const months = moment().diff(moment(birthdate, DATE_FORMAT), 'month')
  const days = moment().diff(moment(birthdate, DATE_FORMAT), 'day');
  if (days <= 60) {
      return dateDeclension(days, 'days')
  }
  if (days <= 730) {
      return dateDeclension(months, 'months')
  }
  const monthsCount = dateDeclension(months - (years * 12), 'months');
  return `${dateDeclension(years, 'years')} ${+monthsCount?.split(' ')?.[0] === 0 ? '' : dateDeclension(months - (years * 12), 'months')}`
}

export const assignmentByGenderGroup = (id) => {
    if (id == 1) {
        return ["выбраковка", "племенное ядро", "ремонт", "откорм"]
    } else if (id == 2) {
        return ["выбраковка", "кастрат", "производитель", "ремонт", "откорм"]
    }
    return [];
}