function load(){
    firebase.database().ref('users').on('value',function(v){
        console.log(v.val());
    });
}
window.addEventListener('load', load);