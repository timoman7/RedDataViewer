(function(){
    let currentUser;
    let Users = [];
    function main(newInfo){
        let userDiv = document.querySelector('#users');
        let dataTemplate = document.querySelector('#dataTemplate');
        let userTemplate = document.querySelector('#userTemplate');
        for(let u in newInfo){
            let userId = u;
            let userData = newInfo[u];
            if(userData!=Users[u]){
                let oldUser = document.querySelector(`.user#user-${userId}`);
                if(oldUser){
                    oldUser.parentElement.removeChild(oldUser);
                }
                userTemplate.content.querySelector('.username').innerHTML = userId;
                function recurData(obj, parEl){
                    for(let kn in obj){
                        let tLI = document.createElement('li');
                        tLI.setAttribute('class', 'data-piece')
                        let kv = obj[kn];
                        dataTemplate.content.querySelector('.key').innerHTML = kn;
                        if(typeof kv == 'object'){
                            tLI.appendChild(document.importNode(dataTemplate.content, true));
                            tLI.querySelector('.value').classList.add('object');
                            recurData(kv, tLI.querySelector('.value'));
                        }else{
                            dataTemplate.content.querySelector('.value').innerHTML = kv;
                            tLI.appendChild(document.importNode(dataTemplate.content, true));
                        }
                        parEl.appendChild(tLI);
                    }
                }
                recurData(userData, userTemplate.content.querySelector('.data-pieces'));
                userTemplate.content.querySelector('.user').setAttribute('id',userId);
                let cUser = document.importNode(userTemplate.content, true);
                userDiv.appendChild(cUser);
            }
        }
        Object.keys(newInfo).map(k=>{
            Users[k]=newInfo[k];
        });
        window.Users = Users;
    }
    firebase.auth().getRedirectResult().then((result)=>{
        firebase.auth().onAuthStateChanged(user =>{
            let credential = result.credential;
            if(user != null){
                currentUser = firebase.auth().currentUser;
                firebase.database().ref('users').on('value',(v)=>{
                    main(v.val());
                });
            }
        });
    },(error)=>{
        let email = error.email;
        let credential = error.credential;
    });
    function login(){
        var provider;
        provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function(){
            return firebase.auth().signInWithRedirect(provider);
        });
    }
    function logout(){
        firebase.database().ref(`users/${currentUser.uid}`).update({
            online: false
        });
        firebase.auth().signOut().then(()=>{
            location.reload();
        }).catch((error)=>{
            // An error happened.
            console.log(error);
            alert("Somehow you screwed up logging out.");
        });
    }
    function load(){
        let lgin = document.querySelector('#login');
        let lgot = document.querySelector('#logout');
        lgin.addEventListener('click', login);
        lgot.addEventListener('click', logout);
        setInterval(function(){
            if(firebase.auth().currentUser){
                lgin.classList.remove('visible');
                lgin.classList.add('hidden');
            }
            if(firebase.auth().currentUser){
                lgot.classList.remove('hidden');
                lgot.classList.add('visible');
            }
        }, 100);
    }
    window.addEventListener('load', load);
})();