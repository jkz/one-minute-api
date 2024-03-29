# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141115152419) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "matches", force: true do |t|
    t.integer  "user_1_id"
    t.boolean  "user_1_like"
    t.integer  "user_2_id"
    t.boolean  "user_2_like"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "matches", ["user_1_id", "user_2_id"], name: "index_matches_on_user_1_id_and_user_2_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "authentication_token"
    t.string   "facebook_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "public_id"
  end

  add_index "users", ["public_id"], name: "index_users_on_public_id", unique: true, using: :btree

end
