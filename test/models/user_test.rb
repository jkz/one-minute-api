require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "#matches" do
    assert true
  end

  test "#swipe" do
    user_1 = User.create
    user_2 = User.first

    assert_equal user_1.matches.count, 0

    user_1.swipe(user_2, true)

    assert_equal user_1.matches.count, 1

    match = user_1.matches.first

    assert_not match.mutual

    user_2.swipe(user_1, true)
    match.reload

    assert match.mutual
  end

  test "#targets" do
    user_1 = User.first
    user_2 = User.create

    assert_equal user_1.targets.first, user_2
    assert_equal user_1.targets.length, 1

    user_2.swipe(user_1, true)

    assert_equal user_1.targets.length, 1

    user_1.swipe(user_2, true)

    assert_equal user_1.targets.length, 0
  end
end
