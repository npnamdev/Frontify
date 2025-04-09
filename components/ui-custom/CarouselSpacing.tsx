import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Hữu Dũng",
    feedback:
      "Khóa học này thực sự rất tuyệt vời! Tôi đã học được cách xây dựng ứng dụng React từ cơ bản đến nâng cao. Điều tôi ấn tượng nhất là cách giảng viên hướng dẫn từng bước một, giúp tôi hiểu rõ từ nền tảng đến cách tối ưu hiệu suất ứng dụng. Các bài tập thực tế cũng rất hữu ích!",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
  {
    id: 2,
    name: "Trần Thị Minh Anh",
    feedback:
      "Trước đây tôi đã thử học React qua tài liệu trên mạng nhưng cảm thấy khó tiếp thu. Nhờ khóa học này, tôi đã có thể xây dựng một ứng dụng hoàn chỉnh với các thành phần phức tạp, đồng thời hiểu sâu hơn về state management và performance optimization.",
    image: "https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg",
  },
  {
    id: 3,
    name: "Phạm Văn Hưng",
    feedback:
      "Khoá học rất bài bản! Tôi thích nhất cách giảng viên giải thích các khái niệm nâng cao như hooks, context API và cách tối ưu hóa ứng dụng. Những kiến thức này giúp tôi rất nhiều khi áp dụng vào dự án thực tế của mình.",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },
  {
    id: 4,
    name: "Lê Thị Thu Trang",
    feedback:
      "Khóa học không chỉ giúp tôi nâng cao kỹ năng React mà còn giúp tôi có cái nhìn tổng thể hơn về cách phát triển một ứng dụng frontend chuyên nghiệp. Các phần về Redux, lazy loading và performance optimization thực sự rất giá trị.",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
  },
  {
    id: 5,
    name: "Đặng Quang Minh",
    feedback:
      "Tôi rất hài lòng với khóa học này! Giảng viên có phong cách giảng dạy dễ hiểu, ví dụ thực tế và rất chi tiết. Tôi đặc biệt thích phần giải thích về component reusability, giúp tôi cải thiện đáng kể cách tổ chức code của mình.",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
  },
]

export default function CarouselSpacing() {
  return (
    <Carousel className="w-full">
      <CarouselContent className="py-4">
        {testimonials.map((testimonial) => (
          <CarouselItem key={testimonial.id} className="space-x-5 md:basis-1/2 lg:basis-1/3">
            <div className="py-5 px-4 border rounded-xl text-center shadow-md">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto"
              />
              <h4 className="mt-4 font-semibold">{testimonial.name}</h4>
              <p className="mt-2 line-clamp-4 leading-7">{testimonial.feedback}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}