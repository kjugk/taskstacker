class Api::TasklistsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :verify_jwt_token

  def index
    @tasklists = current_user.tasklists.order("created_at DESC")
  end

  def create
    @tasklist = Tasklist.new(tasklist_params)
    @tasklist.user = current_user

    @tasklist.transaction do
      @tasklist.save!
      current_user.unshift_tasklist_id!(@tasklist.id)
    end

    render 'api/tasklists/show', status: :created

  rescue => e
    render json: {messages: @tasklist.errors.full_messages}, status: 422
  end

  def update
    @tasklist = Tasklist.find(params[:id])
    authorize! :manage, @tasklist

    if @tasklist.update(tasklist_params)
      render 'api/tasklists/show', status: :ok
    else
      render json: {messages: @tasklist.errors.full_messages}, status: 422
    end
  end

  def destroy
    @tasklist = Tasklist.find(params[:id])
    authorize! :manage, @tasklist

    @tasklist.transaction do
      @tasklist.destroy!
      current_user.delete_tasklist_id!(@tasklist.id)
    end
    
    head :ok

  rescue => e
    render json: {messages: @tasklist.errors.full_messages}, status: 422
  end

  private

  def tasklist_params
    params.require(:tasklist).permit(:title, task_id_list: [])
  end
end
