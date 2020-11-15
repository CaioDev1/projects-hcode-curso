HTMLFormElement.prototype.save = function(config) {
    let form = this

    form.addEventListener('submit', e => {
      e.preventDefault()
  
      let formData = new FormData(form)
  
      fetch(form.action, {
        method: form.method,
        body: formData
      }).then(response => response.json())
        .then(res => {
          if(res.error) {
            if(typeof config.failure == 'function') config.failure(res.error)
          } else {
            if(typeof config.success == 'function') config.success(res)
          }
        }).catch(err => {
            console.log(err)
        })
    })
}