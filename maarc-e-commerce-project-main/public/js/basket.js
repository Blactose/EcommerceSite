async function addToBasket(itemID) {
    console.log(itemID)

    try {
        const response = await fetch('/add-to-basket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'id': itemID}),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
        } else {
            console.error('Failed to add item to basket:', response.statusText);
        }

    }
    catch (error) {
        console.error('Error adding item to basket:', error);
    }


};