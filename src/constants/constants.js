export const partToIndex = {
  0: 'vamp',
  1: 'quarters',
  2: 'quarters',
  3: 'binding',
  4: 'tongue',
  5: 'eyelets',
  6: 'foxing',
  7: 'foxing_stripe',
  8: 'laces',
  9: 'font'
}

export const defaultTextureUrls = {
  foxing: {
    textures: {
      map: {
        options: {
          repeat: [2, 2]
        },
        image_url: 'https://pic.bbtkids.cn/FkCCuVIxI8NTMb-Pw5heGrcRt9cD'
      },
      normalMap: {
        options: {
          repeat: [28, 28]
        },
        image_url: 'https://pic.bbtkids.cn/FlKtBOKulMFKAW6ayWGBibMBN6Yr'
      }
    }
  },
  insole: {
    textures: {
      map: {
        options: {
          repeat: [28, 28]
        },
        image_url: 'https://pic.bbtkids.cn/Fi3FCwy0ROc_IdCPtuf_QmL2MlHw'
      },
      normalMap: {
        options: {
          repeat: [28, 28]
        },
        image_url: 'https://pic.bbtkids.cn/FtjEkcuxmWy9XGKHYwCuoWFs0J5K'
      }
    }
  },
  vamp: {
    textures: {
      normalMap: {
        options: {
          repeat: [10, 10]
        },
        image_url: 'https://pic.bbtkids.cn/FiQvFit0mQcImJR_W_YBXxlrAetl'
      }
    },
    mesh_options: {
      color: '#fff',
      emissive: '#000',
      metalness: 0,
      roughness: 1
    }
  },
  tip: {
    textures: {
      roughnessMap: {
        options: {
          repeat: [2, 2]
        },
        image_url: 'https://pic.bbtkids.cn/Fs-hm3sCv6-ebdSlwAkFAmE-ZvPC'
      },
      map: {
        options: {
          repeat: [22, 22]
        },
        image_url: 'https://pic.bbtkids.cn/FhPnq55M76RPHmSUSaU83jLZzez2'
      }
    }
  }
}
