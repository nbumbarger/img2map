class CreateMedia < ActiveRecord::Migration
  def change
    create_table :media do |t|
      t.string :file_name
      t.string :name
      t.decimal :lat
      t.decimal :lng
      t.timestamps null: false
    end
  end
end