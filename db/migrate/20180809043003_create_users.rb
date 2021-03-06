class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :name
      t.string :google_uid
      t.string :image_url
      t.boolean :new_user, default: true

      t.timestamps
    end
  end
end
