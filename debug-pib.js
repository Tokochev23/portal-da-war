console.log('PIB Afeganistao atual:', await db.collection('paises').doc('afeganistao').get().then(doc => doc.data()));
