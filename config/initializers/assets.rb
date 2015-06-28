# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
Rails.application.config.assets.precompile += %w[*.png *.jpg *.jpeg *.gif]
Rails.application.config.assets.precompile += %w[html5shiv.js html5shiv-printshiv.js]