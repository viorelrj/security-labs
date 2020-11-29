const $register = document.getElementById('register');

$register.addEventListener('submit', handleSubmit)


function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const email = document.getElementById('email').value;

    fetch(`http://localhost:3000/control/${email}`)
    return;
}