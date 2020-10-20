class Utils {
    static formatDate(date) {
        date = new Date(date)
        
        return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
    }
}