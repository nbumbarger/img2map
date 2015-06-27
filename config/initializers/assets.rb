# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
image_exts = ['*.png', '*.jpg', '*.jpeg', '*.gif']
html5_shiv = ['html5shiv.js', 'html5shiv-printshiv.js']
Rails.application.config.assets.precompile +=  image_exts + html5_shiv