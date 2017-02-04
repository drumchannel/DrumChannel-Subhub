<?php
/**
 * The Template for displaying all single lessons.
 *
 * Override this template by copying it to yourtheme/sensei/single-lesson.php
 *
 * @author 		Automattic
 * @package 	Sensei
 * @category    Templates
 * @version     1.9.0
 */

?>

<?php  new_sensei_header();  ?>

<?php
//project id - vidmover
$project_id = get_field('project_id', $post->ID);

//create history
create_history();

//Course Of lesson
$course_id =  get_post_meta( $post->ID, '_lesson_course', true);
if($course_id)
  $course = get_the_title($course_id);
else
  $course = "";

$args = array(
  'orderby' => 'menu_order',
  'order'   => 'DESC',
  'post_type'     => 'lesson',
  'post_status'   => 'publish',
  'meta_query' => array(
  array(
  'key' => '_lesson_course',
  'value' => $course_id
)
)
);

//Get lessons in this course
$current_post_id = $post->ID;
$posts_of_this_course = array();
$getPosts = new WP_Query($args);
if ( $getPosts->have_posts() ) {
  while ( $getPosts->have_posts() ) {
    $getPosts->the_post();
    //if(get_the_ID()!=$current_post_id){
    $post_of_this_course['id'] = get_the_ID();
    $post_of_this_course['title']  = get_the_title();
    $post_of_this_course['length'] = get_post_meta( get_the_ID(), '_lesson_length', true);
    $post_of_this_course['link'] = get_post_permalink(get_the_ID());
    $post_of_this_course['thumbnail'] = get_thumbnail(get_field('project_id',get_the_ID()));
    $posts_of_this_course[] = $post_of_this_course;
    //}
  }
  /* Restore original Post Data */
  wp_reset_postdata();
}


//echo do_action('sensei_single_lesson_content_inside_before', $post->ID );
//Contact lesson teacher and title
?>
<?php
//View lesson quiz and lesson media and lesson tags
//echo do_action( 'sensei_single_lesson_content_inside_after', $post->ID );
?>

<?php
if ( sensei_can_user_view_lesson() ) {
?>

<section class="lesson--video">
  <div class="grid inner inner_tag">
    <div class="col-12-12">
      <div class="lesson--video__current">
        <?php echo do_action( 'sensei_lesson_video', $post->ID ); ?>
      </div>
      <!--
<div class="lesson--video__next">
<ul>
<?php
                                      $index = 1;
                                      foreach ($posts_of_this_course as $post_of_this_course) {
                                        $index++;
?>
<li>
<a href="<?php echo $post_of_this_course['link']; ?>">
<img width="100%" src="<?php echo $post_of_this_course['thumbnail']; ?>"/>
</a>
</li>
<?php
                                        if($index>5)
                                          break;
                                      }
?>
</ul>
</div>
-->
    </div>
    <!--
<div class="col-4-12">
<div class="lesson--video__sub--topics">
<span class="spacer"></span>
<div class="topics">
<h2><?php echo $course; ?></h2>

<?php
                                      $index = 0;
                                      foreach ($posts_of_this_course as $post_of_this_course) {
                                        $index++;
                                        if($post->ID != $post_of_this_course['id']){
?>
<div class="topics__current">
<a href="<?php echo $post_of_this_course['link']; ?>">
<div class="col-2-12">
<span class="index"><?php echo $index; ?></span>
<span class="fa fa-play-circle-o"></span>
</div>
<div class="col-6-12">
<h3><?php echo $post_of_this_course['title']; ?></h3>
<p><!-- 0% watched --></p>
  </div>
<div class="col-4-12">
  <?php echo $post_of_this_course['length']; ?> Min.
</div>
</a>
</div>
<?php
                                                                                   } else {
                                          echo '<div class="topics__current selected">
                            <div class="col-2-12">
                                <span class="index">1</span>
                                <span class="fa fa-play-circle-o"></span>
                            </div>
                            <div class="col-6-12">
                                <h3>'.get_the_title().'</h3>
                                <p><!-- 2% watched --></p>
                            </div>
                            <div class="col-4-12">
                                '.get_post_meta( $post->ID, '_lesson_length', true).' Min.</div>
                        </div>';

                                        }
                                      }
?>
</div>
</div>
</div>

</div>
</section>

<section class="lesson--details grid inner inner_tag">
  <div class="lesson--details__tab col-12-12">
    <ul class="col-8-12">
      <li class="selected"><a href="#lessonDetails" title="Lesson Details" data-tab="1">Lesson Details</a></li>
      <!--
<li><a href="#notation" title="Notation" data-tab="2">Notation</a></li>
-->
      <li><a href="#downloads" title="Downloads" data-tab="3">Downloads</a></li>
      <li><a href="#comments" title="Comments" data-tab="4">Comments</a></li>
    </ul>
  </div>
  <div class="col-8-12 lesson--details__content" id="content_wrapper">
    <div class="lesson--details__tab">
      <div data-tab-content="1" class="tab__content selected">
        <div class="lesson--details__desc">
          <div>
            <h1><?php echo get_the_title(); ?></h1>
            <a href="#contactInstructor" title="Contact Lesson Teacher" class="contact--lesson--instructor">Contact Lesson Teacher</a>
            <div class="contact--lesson--instructor__form hide" data-event="contactInstructor">
              <textarea rows="5" cols="97" placeholder="Enter your message"></textarea>
              <a href="#sendMessageToInstructor" title="Contact Lesson Teacher" class="contact--lesson--instructor">Send Message</a>
            </div>
            <div class="contact--lesson--instructor__message hide" data-event="sendMessageToInstructor">
              <span class="fa fa-check"></span>Your private message has been sent
            </div>
            <div class="lesson--level col-12-12">
              <p>Difficulty:
                <?php
                                      $complexity_array   = Sensei()->lesson->lesson_complexities();

                                      echo $complexity_array[get_post_meta( $post->ID, '_lesson_complexity', true )];
                ?>
              </p>
              <?php
                                      if(is_lesson_fav($post->ID)){
              ?>
              <a href="
                       <?php echo admin_url( 'admin-post.php?action=mark_as_unfavorite&post_id=' ).$post->ID; ?>"><icon class="fa fa-heart made-fav" data-event="markFavourite"></icon></a>
              <?php
                                      } else {
              ?>
              <a href="
                       <?php echo admin_url( 'admin-post.php?action=mark_as_favorite&post_id=' ).$post->ID; ?>"><icon class="fa fa-heart made-unfav" data-event="markFavourite"></icon></a>
              <?php
                                      }
              ?>
            </div>
            <p><?php echo $post->post_content; ?></p>
            <a href="#lessonComplete" title="Complete Lesson" class="lesson--status">Complete Lesson</a>
            <?php
                                      //echo sensei_complete_lesson_button();
                                      //sensei_complete_lesson_button();
            ?>
            <a href="#" title="Lesson Complete" class="lesson--status complete hide" data-event="lessonComplete">Lesson Complete</a>
          </div>
        </div>
      </div>
      <!--
<div data-tab-content="2" class="tab__content hide">
<div class="notes">
<object data="https://drumchannelwpdev.com/docs/notes.pdf" type="application/pdf" width="100%" height="100%">
<iframe src="https://drumchannelwpdev.com/docs/notes.pdf" width="100%" height="100%" style="border: none;">
This browser does not support PDFs. Please download the PDF to view it: <a href="https://drumchannelwpdev.com/docs/notes.pdf">Download PDF</a>
</iframe>
</object>
</div>
</div>
-->
      <div data-tab-content="3" class="tab__content hide">
        <div class="lesson--details__desc">
          <?php
                                      //Get media uploaded
                                      $media = get_post_meta( $post->ID, '_attached_media', true );
                                      if( $media && is_array( $media ) && count( $media ) > 0 ) {
                                        foreach( $media as $k => $file ) {
                                          $file_parts = explode( '/', $file );
                                          $file_name = array_pop( $file_parts );
                                          echo '<div class="downloads">';
                                          echo '<a href="' . esc_url( $file ) . '" target="_blank"><span class="fa fa-cloud-download"></span>'.esc_html( $file_name ).'</a>';
                                          echo '</div>';
                                        }
                                      }
          ?>
        </div>
      </div>
      <div data-tab-content="4" class="tab__content hide">
        <div class="lesson__comments">
          <!-- Comments -->
          <?php echo lesson_comments(); ?>
        </div>
      </div>
    </div>
  </div>
  <div class="col-4-12 lesson--details__content">
    <div class="lesson--details__author-info" id="authorInfo_wrapper">
      <h3>About the Instructor</h3>
      <div class="author__info--desc">
        <span class="author--pic">
          <img style="border-radius: 50%;" src="<?php echo get_avatar_url( get_the_author_meta( 'user_email', $post->post_author ), '80' ); ?>" />
        </span>
        <h4>
          <?php the_author_meta( 'display_name', $post->post_author ); ?>
        </h4>
        <p><?php echo the_author_meta('description', $post->post_author); ?></p>
      </div>
      <!--
<div class="related__lessons">
<h3>Released Lessons</h3>
<?php
                                      $newest_releases = get_newest_releases();
                                      foreach ($newest_releases as $newest_release) {
?>
<div class="related__lessons--item">
<div class="related__lessons--pic">
<a href="<?php echo $newest_release['link']; ?>">
<img style="width:100%" src="<?php echo get_thumbnail(get_field('project_id',$newest_release['id'])); ?>"/>
</a>
</div>
<div class="related__lessons--info">
<a href="<?php echo $newest_release['link']; ?>">
<h3><?php echo $newest_release['title']; ?></h3>
</a>
<p>
<?php
                                                                                     echo get_the_author_meta('display_name', $newest_release['author']);
?>
</p>
</div>
</div>
<?php
                                                                                    }
?>
</div>
-->
    </div>
  </div>
</section>

<?php
                                     } else {
  if( $user->ID != 0 ){
    echo "Please purchase the lesson to view it.   ";
    echo '<a href="'.get_permalink('224').'">Go to Dashboard</a>';
  } else {
    wp_redirect( wp_login_url( get_permalink() ) );
  }
}
new_sensei_footer();
?>
