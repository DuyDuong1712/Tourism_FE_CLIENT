const getChildren = (records) => {
  return records.reduce((acc, record) => {
    if (record.children && record.children.length === 0) {
      acc.push(record);
    } else if (record.children && record.children.length > 0) {
      acc = acc.concat(getChildren(record.children));
    }
    return acc;
  }, []);
}


export default getChildren;