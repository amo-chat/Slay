const blocks = {
  '4gems': {
    gems: 4,
    iosProducts: ['com.habitrpg.ios.Slay.4gems'],
    androidProducts: ['com.habitrpg.android.slay.iap.4gems'],
    price: 99, // in cents, web only
  },
  '21gems': {
    gems: 21,
    iosProducts: [
      'com.habitrpg.ios.Slay.20gems',
      'com.habitrpg.ios.Slay.21gems',
    ],
    androidProducts: [
      'com.habitrpg.android.slay.iap.20.gems',
      'com.habitrpg.android.slay.iap.21.gems',
    ],
    price: 499, // in cents, web only
  },
  '42gems': {
    gems: 42,
    iosProducts: ['com.habitrpg.ios.Slay.42gems'],
    androidProducts: ['com.habitrpg.android.slay.iap.42gems'],
    price: 999, // in cents, web only
  },
  '84gems': {
    gems: 84,
    iosProducts: ['com.habitrpg.ios.Slay.84gems'],
    androidProducts: ['com.habitrpg.android.slay.iap.84gems'],
    price: 1999, // in cents, web only
  },
};

// Add the block key to all blocks
Object.keys(blocks).forEach(blockKey => {
  const block = blocks[blockKey];
  block.key = blockKey;
});

export default blocks;
