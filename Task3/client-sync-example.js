async function syncLoginData(identifier, clientData)
{
    const response = await fetch('http://localhost:3000/sync-login-data',
    {
        method: 'POST',
        headers:
        {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            identifier,
            clientData
        })
    });

    const payload = await response.json();

    if (!response.ok)
    {
        throw new Error(payload.message || 'Failed to sync login data');
    }

    return payload;
}

// Example usage after a successful login:
// syncLoginData(user.email || deviceId, { deviceId, browser: navigator.userAgent })
//   .then((data) => console.log('Sync result:', data))
//   .catch((error) => console.error(error.message));