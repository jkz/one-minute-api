class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :authentication_token, uniq: true
      t.string :facebook_id, uniq: true

      t.timestamps
    end
  end
end
