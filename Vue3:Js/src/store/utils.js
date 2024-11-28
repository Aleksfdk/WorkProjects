export function object2Url(params = {}) {
  let param = '';
  Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && typeof params[key] !== 'object' && key == 'page' && key == 'perPage') (param += `&${key}=${params[key]}`);
      if (typeof params[key] === 'object') {
          const innerObj = params[key];
          Object.keys(innerObj).forEach((innerKey) => {
              const innerObjKey = innerObj[innerKey];
              // Если ключ объекта в значении содержит массив
              if (Array.isArray(innerObjKey)) {
                  const result = innerObj[innerKey].map((el) => {
                      let resultParams = '';
                          // если массив с примитивными типами
                          // нужен вид filters[gender_group][0]=2
                          if (typeof el !== 'object') {
                              // resultParams += `&${key}[${innerKey}][${index}]=${el}`;
                              resultParams += `&${key}[${innerKey}][]=${el}`;
                          }
                      return resultParams;
                  }).join('&');

                  param += result;
              } else {
                  (param += `&${key}[${innerKey}]=${innerObj[innerKey]}`);
              }
          });
      }
  });
  param = param.replace('&', '?');
  return param;
}