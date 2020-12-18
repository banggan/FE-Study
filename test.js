function format(num) {
    return (
      num &&
      num.toString().replace(/^\d+/, m => m.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'))
    )
  }
  console.log(format(1234567.9567)) // output: 1,234,567.90