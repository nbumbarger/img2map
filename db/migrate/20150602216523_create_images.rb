class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :file
      t.decimal :lat
      t.decimal :lng
      t.timestamps null: false
    end
  end
end